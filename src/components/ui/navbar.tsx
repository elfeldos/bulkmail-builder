import { Mail } from "lucide-react";

const Navbar = () => {
    return (
        <div className="px-4">
            <div className="my-8 bg-white drop-shadow-lg rounded-md max-w-4xl mx-auto px-4 py-4">
                <div className="grid grid-cols-3 items-center">
                    <div className="flex items-center col-span-2 gap-3">
                        <Mail className="w-7 h-7 text-primary"/>
                        <div className="font-bold text-md md:text-xl">
                            Bulkmail Builder
                        </div>
                    </div>
                    <div className="text-right mr-2 hover:drop-shadow-lg text-lg hover:text-xl transition-all duration-300">
                        <a href="https://buymeacoffee.com/elfeldos">☕️</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar;