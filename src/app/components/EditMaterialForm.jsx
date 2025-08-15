import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UploadMaterialForm } from "./UploadMaterialForm";
import { Pen } from "lucide-react";

const EditMaterialForm = ({ materialData }) => {
  const [open, setOpen] = useState(false);

  const handleFormSubmit = (success) => {
    if (success) {
      setOpen(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Pen />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[] h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
            <DialogDescription>
              Edit the material details here.
            </DialogDescription>
          </DialogHeader>
          <UploadMaterialForm
            initialData={materialData}
            editMode={true}
            onSuccess={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditMaterialForm;
