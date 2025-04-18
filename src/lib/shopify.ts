export async function getMenu(handle: string) {
  try {
    const response = await fetch('http://localhost:8081/api/menu');
    const data = await response.json();

    // Transform the data to match the expected format
    return {
      items: data.menu.map((item: any) => ({
        title: item.title,
        url: item.path,
        items: item.items || []
      }))
    };
  } catch (error) {
    console.error('Error fetching menu:', error);
    return { items: [] };
  }
}
