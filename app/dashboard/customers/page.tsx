import Card from "@/app/ui/cards/Card";
import Keyboard from "@/app/ui/keyboard/Keyboard";
import NumbersKeyboard from "@/app/ui/keyboard/NumbersKeyboard";

export default function Page() {
  let characterKey : string = "S";
    return <div>
      {/* <NumbersKeyboard/> */}
      {/* <Keyboard/> */}
      <Card characterKey ={characterKey}/>
    </div>;
}