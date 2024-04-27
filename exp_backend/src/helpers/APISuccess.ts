interface ResponseObject {
    success: true;
    data?: any;
}

export const success = (data?: any): ResponseObject => {
    if (data) {
        return { success: true, data };
    }
    return { success: true };
};
