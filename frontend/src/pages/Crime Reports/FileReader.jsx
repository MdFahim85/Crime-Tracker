import { Label } from "@/components/ui/label";

function FileReader({ fileData }) {
  return (
    <>
      <img
        src={fileData.url}
        alt="Stored File"
        className="w-full max-h-[300px] object-cover rounded-md"
      />
    </>
  );
}

export default FileReader;
