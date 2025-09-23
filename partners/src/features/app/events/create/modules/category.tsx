import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { EventFormState } from "@/features/app/global/hooks/logic";
import { Category } from "@/features/app/global/types";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type EventCategoryProps = {
  updateForm: <K extends keyof EventFormState>(
    field: K,
    value: EventFormState[K]
  ) => void;
  formState: EventFormState;
} & Category;

export const EventCategory = (props: EventCategoryProps) => {
  const { name, image, _id, subcategories, updateForm, formState } = props;
  const [isOpen, setIsOpen] = useState(false);

  const hasSubcategories = subcategories && subcategories.length > 0;

  const handleCategoryClick = () => {
    if (!hasSubcategories) {
      updateForm("category", {
        id: _id,
        name,
        image: image,
      });
      updateForm("subCategory", {
        name: "",
        id: "",
        image: image,
      });
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleSubcategoryClick = (id: string, subCategoryName: string) => {
    updateForm("category", {
      id: _id,
      name,
      image: image,
    });
    updateForm("subCategory", {
      id,
      name: subCategoryName,
      image: image,
    });
    setIsOpen(false);
  };

  return (
    <div className="w-full border-b overflow-hidden mb-1">
      <motion.button
        className={cn(
          "w-full flex items-center justify-between py-5 px-1 transition-colors duration-200",
          formState.category.id === _id &&
            !hasSubcategories &&
            "bg-primary/10 hover:bg-primary/15"
        )}
        onClick={handleCategoryClick}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-2.5">
          <img
            src={image}
            alt="icon"
            className="w-5 h-5 object-fit object-center"
          />

          <span className="text-sm font-bold text-primary">{name}</span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-500"
        >
          {hasSubcategories ? (
            <ChevronDown size={18} className="stroke-primary" />
          ) : formState.category.id === _id ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check size={16} className="text-primary" />
            </motion.div>
          ) : (
            <div className="w-4 h-4" />
          )}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && hasSubcategories && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            // className="border-t"
          >
            {subcategories.map((subcategory) => (
              <motion.button
                key={subcategory._id}
                className={cn(
                  "w-full flex items-center justify-between py-3.5 pl-7 transition-colors duration-150",
                  formState.subCategory.id === subcategory._id &&
                    "bg-primary/5 hover:bg-primary/10"
                )}
                onClick={() =>
                  handleSubcategoryClick(subcategory._id, subcategory.name)
                }
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={subcategory.image}
                    alt="icon"
                    className="w-5 h-5 object-fit object-center"
                  />
                  <span className="text-xs font-bold text-primary">
                    {subcategory.name}
                  </span>
                </div>

                {formState.subCategory.id === subcategory._id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="mr-2"
                  >
                    <Check size={14} className="text-primary" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
