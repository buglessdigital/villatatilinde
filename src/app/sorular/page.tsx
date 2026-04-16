import { Metadata } from "next";
import SorularContent from "./SorularContent";

export const metadata: Metadata = {
    title: "Sorular - Villa Tatilinde",
    description: "Villalarımız hakkında merak ettiğiniz her şeyi bize sorun.",
};

export default function SorularPage() {
    return <SorularContent />;
}
