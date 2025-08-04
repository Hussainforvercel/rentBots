import axios from "axios";

export const removeImage = async ({ url, fileName }) => {
    try {
        const response = await axios.post(`${url}`, { fileName }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        const { status } = response;

        if (status) {
            return true;
        }
    } catch (error) {
        console.log("Error in remove image", error);
        return false;
    }
}
