// Fix the type issue in the Travels component
const namesList = data?.map(item => item.name) || [];
const emailsList = data?.map(item => item.email) || [];

// Use these arrays in your component instead of accessing .name directly