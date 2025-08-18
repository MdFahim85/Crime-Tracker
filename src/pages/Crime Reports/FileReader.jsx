import { Label } from "@/components/ui/label";

function FileReader({ fileData }) {
  if (!fileData) return null;

  if (fileData.startsWith("data:image")) {
    return (
      <>
        <img
          src={fileData}
          alt="Stored File"
          className="w-full max-h-[300px] object-cover rounded-md"
        />
        <Label className="block text-slate-700 my-2 text-xl">Crime Image</Label>
      </>
    );
  }
}

export default FileReader;
