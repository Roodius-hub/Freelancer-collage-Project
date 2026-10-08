import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import Joblist from "../components/jobs/JobList";
import { Navbar } from "@/components/layout/Navbar";

// type Props = Omit<ImageProps, "src"> & {
//   srcLight: string;
//   srcDark: string;
// };

// const ThemeImage = (props: Props) => {
//   const { srcLight, srcDark, ...rest } = props;

//   return (
//     <>
//       <Image {...rest} src={srcLight} className="imgLight" />
//       <Image {...rest} src={srcDark} className="imgDark" />
//     </>
//   );
// };

export default function Home() {
  return (
    <div>
      <Navbar/>
      <div className="pt-10 max-w-6xl mx-auto px-6">
          <Joblist   />
      </div>
    </div>
  );
}
