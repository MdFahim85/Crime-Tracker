// components/LoadingSpinner.jsx
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
  );
}
