import { NewsList } from "@/components/News/NewsList";

const News = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Actualités</h1>
      <NewsList />
    </div>
  );
};

export default News;