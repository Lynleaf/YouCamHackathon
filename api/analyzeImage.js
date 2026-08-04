const API_KEY = "sk-ZHULp6Z4BM7jIVkQzYSElTZMK64svo4yiVycdn3F630hF7fcLYyE8Qz4A9nUS4iB";

const BASE_URL = "https://yce-api-01.makeupar.com";
import { File } from "expo-file-system";
import { Blob } from "expo-blob";

import { faceAnalysisErrors } from "../utils/faceAnalysisErrors";

// Main function called to analyze image for colors
export async function analyzeImage(uri) {
    console.log("Image URI:", uri);

    const result = await getUploadURL(uri);

    const file = result.data.files[0];
    const request = file.requests[0];
    console.log("Signed headers:", request.headers);
    await uploadImage(request.url,uri,request.headers);

    const analysisTaskId = await createAnalysisTask(file.file_id);
    console.log("Task ID:", analysisTaskId);
    
    const pollResults = await pollAnalysisTask(analysisTaskId);

    console.log("Analysis results:", pollResults);
    return pollResults;
}
async function getUploadURL(uri) {
    const imageFile = new File(uri);

    console.log("Image size:", imageFile.size);

    const resp = await fetch(
        "https://yce-api-01.makeupar.com/s2s/v2.0/file",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + API_KEY,
            },
            body: JSON.stringify({
                files: [
                    {
                        content_type: "image/jpeg",
                        file_name: "profileImage.jpg",
                        file_size: imageFile.size,
                    },
                ],
            }),
        }
    );
    
    return await resp.json();
}

async function uploadImage(uploadUrl, imageUri, headers) {
    const response = await fetch(imageUri);
    const arrayBuffer = await response.arrayBuffer();
    const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
            "Content-Length": headers["Content-Length"],
            "Content-Type": headers["Content-Type"],
        },
        body: arrayBuffer,
    });

    console.log("Upload status:", uploadResponse.status);

    if (!uploadResponse.ok) {
        console.log(await uploadResponse.text());
        throw new Error("Upload failed");
    }
}

async function createSkinTask(fileId) {

    const response = await fetch(
        `${BASE_URL}/s2s/v2.0/task/skin-analysis`,
        {
            method: "POST",

            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                file_id: fileId

            })
        }
    );


    const data = await response.json();

    console.log("TASK RESPONSE:", data);


    return data.data.task_id;
}
async function createAnalysisTask(fileId) {
    const response = await fetch(
        "https://yce-api-01.makeupar.com/s2s/v2.0/task/skin-tone-analysis",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + API_KEY,
            },
            body: JSON.stringify({
                src_file_id: fileId,
                face_angle_strictness_level: "high" //optional, change to control checking strictness of face angle
            }),
        }
    );

    const data = await response.json();

    console.log("Create task response:", data);

    if (data.status !== 200) {
        throw new Error(JSON.stringify(data));
    }

    return data.data.task_id;
}
async function pollAnalysisTask(taskId) {
    while (true) {
        const response = await fetch(
            `https://yce-api-01.makeupar.com/s2s/v2.0/task/skin-tone-analysis/${taskId}`,
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + API_KEY,
                },
            }
        );

        const data = await response.json();

        console.log("Polling status:", data);

        if (data.data.task_status === "success") {
            return data.data.results;
        }
        if (data.data.task_status === "error") {
            const errorCode = data.data.error_code;
            throw new Error(faceAnalysisErrors[errorCode] || "Unable to analyze this photo. Please try another image.");
        }
        // wait 1 second before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}