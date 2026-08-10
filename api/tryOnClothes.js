import * as FileSystem from "expo-file-system/legacy";

const API_BASE =
    "https://yce-api-01.makeupar.com/s2s/v2.0";

// Replace this with your NEW key.
// Ideally this should eventually live on your backend.
const API_KEY = "sk-ZHULp6Z4BM7jIVkQzYSElTZMK64svo4yiVycdn3F630hF7fcLYyE8Qz4A9nUS4iB";

export const tryOnClothes = async (
    bodyImageUri,
    clothingImageUrl
) => {
    console.log("Uploading body image...");

    const bodyFileId = await uploadImage(
        bodyImageUri,
        "bodyImage.jpg"
    );

    console.log("Body file ID:", bodyFileId);

    console.log("Creating try-on task...");

    const taskId = await createTryOnTask(
        bodyFileId,
        clothingImageUrl
    );

    console.log("Try-on task:", taskId);

    const resultUrl =
        await pollTryOnTask(taskId);

    console.log("Try-on result:", resultUrl);

    return resultUrl;
};


const uploadImage = async (uri, fileName) => {

    // --------------------------------------------------
    // 1. Get information about the local image
    // --------------------------------------------------

    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (!fileInfo.exists) {
        throw new Error(
            `Image does not exist: ${uri}`
        );
    }

    console.log("Image URI:", uri);
    console.log("Image size:", fileInfo.size);


    // --------------------------------------------------
    // 2. Ask Perfect Corp for an upload URL
    // --------------------------------------------------

    const response = await fetch(
        `${API_BASE}/file/cloth-v3`,
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                files: [
                    {
                        content_type: "image/jpg",
                        file_name: fileName,
                        file_size: fileInfo.size,
                    },
                ],
            }),
        }
    );


    const data = await response.json();

    console.log(
        "File API status:",
        response.status
    );

    console.log(
        "File API response:",
        data
    );


    if (!response.ok) {
        throw new Error(
            data.error ||
            data.message ||
            "Failed to create file upload"
        );
    }


    // --------------------------------------------------
    // 3. Get file information from Perfect Corp
    // --------------------------------------------------

    const file = data.data.files[0];

    const fileId = file.file_id;

    const uploadRequest = file.requests[0];

    const uploadUrl = uploadRequest.url;

    const uploadHeaders = uploadRequest.headers;


    console.log(
        "File ID:",
        fileId
    );

    console.log(
        "Upload URL received"
    );

    console.log(
        "Upload headers:",
        uploadHeaders
    );


    // --------------------------------------------------
    // 4. Read the actual local image
    // --------------------------------------------------

    const imageResponse = await fetch(uri);

    if (!imageResponse.ok) {
        throw new Error(
            `Could not read image: ${imageResponse.status}`
        );
    }

    const arrayBuffer =
        await imageResponse.arrayBuffer();

    console.log(
        "Actual image bytes:",
        arrayBuffer.byteLength
    );


    // --------------------------------------------------
    // 5. Upload image to Perfect Corp's signed URL
    // --------------------------------------------------

    const uploadResponse = await fetch(
        uploadUrl,
        {
            method: "PUT",

            headers: {
                "Content-Length":
                    uploadHeaders["Content-Length"],

                "Content-Type":
                    uploadHeaders["Content-Type"],
            },

            body: arrayBuffer,
        }
    );


    console.log(
        "Image upload status:",
        uploadResponse.status
    );


    if (!uploadResponse.ok) {

        const errorText =
            await uploadResponse.text();

        console.log(
            "Image upload error:",
            errorText
        );

        throw new Error(
            "Failed to upload image to Perfect Corp"
        );
    }


    console.log(
        `${fileName} uploaded successfully`
    );


    // --------------------------------------------------
    // 6. Return file ID
    // --------------------------------------------------

    return fileId;
};


const createTryOnTask = async (
    bodyFileId,
    clothingImageUrl
) => {

    const response = await fetch(
        `${API_BASE}/task/cloth-v3`,
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                src_file_id: bodyFileId,
                ref_file_url: clothingImageUrl,
                garment_category: "full_body",
            }),
        }
    );


    const data = await response.json();

    console.log(
        "Create task status:",
        response.status
    );

    console.log(
        "Create task response:",
        data
    );


    if (!response.ok) {
        throw new Error(
            data.error ||
            data.message ||
            "Failed to create try-on task"
        );
    }


    return data.data.task_id;
};


const pollTryOnTask = async (taskId) => {

    while (true) {

        const response = await fetch(
            `${API_BASE}/task/cloth-v3/${taskId}`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );


        const data = await response.json();


        if (!response.ok) {
            throw new Error(
                data.error ||
                data.message ||
                "Failed to check try-on task"
            );
        }


        const taskData = data.data;

        const status =
            taskData.task_status;


        console.log(
            "Try-on status:",
            status
        );


        if (status === "success") {

            const resultUrl =
                taskData.results?.url;

            if (!resultUrl) {
                throw new Error(
                    "Try-on succeeded but no result URL was returned"
                );
            }

            return resultUrl;
        }


        if (status === "error") {

            const errorMessage =
                taskData.error ||
                "Clothing try-on failed";

            throw new Error(errorMessage);
        }


        await new Promise(
            resolve => setTimeout(resolve, 2000)
        );
    }
};