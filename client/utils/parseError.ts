export default function parseError(error: any) {
    return String(
        error?.response?.data?.message ||
            error?.response?.data ||
            error?.data?.message ||
            error?.data ||
            error
    );
}
