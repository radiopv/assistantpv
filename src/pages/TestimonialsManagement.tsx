import { TestimonialsAdmin } from "@/components/Admin/TestimonialsAdmin";

const TestimonialsManagement = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion des témoignages</h1>
      <TestimonialsAdmin />
    </div>
  );
};

export default TestimonialsManagement;