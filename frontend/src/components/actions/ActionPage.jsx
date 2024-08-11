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
    <main style={{ paddingTop: "2rem" }}>
      <ActionSelect />
      <Scanner />
      <ScannedItems />
    </main>
  );
};

export default ActionPage;
