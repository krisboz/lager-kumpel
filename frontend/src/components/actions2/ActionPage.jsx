import ActionSelect from "./ActionSelect";
import Scanner from "./Scanner";
import ScannedItems from "./ScannedItems";
import useActionStore from "../../zustand/useActionStore";

const ActionPage = () => {
  const { action } = useActionStore();

  if (!action) {
    return <ActionSelect />;
  }

  return (
    <>
      <ActionSelect />
      <Scanner />
      <ScannedItems />
    </>
  );
};

export default ActionPage;
