export default async () => {
    const response = await fetch('./backend/CRUD/select.php');
    const data = await response.json();
    return data;
}