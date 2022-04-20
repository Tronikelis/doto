// https://stackoverflow.com/questions/8495687/split-array-into-chunks
export default function chunk<T>(array: T[], size: number) {
    if (array.length < 1) return [array];

    const chunked: T[][] = [];

    for (let i = 0; i < array.length; i += size) {
        const chunk = array.slice(i, i + size);
        chunked.push(chunk);
    }

    return chunked;
}
