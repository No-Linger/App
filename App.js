import { StatusBar } from "expo-status-bar";
import Main from "./src";
import Svg,{Image} from 'react-native-svg';
export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Main />
    </>
  );
}
