import { MemoriesList } from "@/components/Memories/MemoriesList";

const MyMemories = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mes souvenirs</h1>
      <MemoriesList />
    </div>
  );
};

export default MyMemories;