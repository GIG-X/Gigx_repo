// app/items/[id]/page.jsx
export default function ItemPage({ params }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold">Item: {params.id}</h1>
      <p className="mt-2 text-neutral-600">Protected item details.</p>
    </div>
  );
}
