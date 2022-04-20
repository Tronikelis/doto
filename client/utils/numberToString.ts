export default function numberToString(number: number) {
    if (Math.abs(number) < 1000) return number.toString();

    const thousands = number / 1000;
    return thousands.toFixed(1) + "K";
}
