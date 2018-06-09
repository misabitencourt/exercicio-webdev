

export default async () => {
    const response = await fetch('/backend/index.php');
    const data = await response.json();

    return data;
}