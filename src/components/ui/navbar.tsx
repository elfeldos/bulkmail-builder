import { Mail } from "lucide-react";

const Navbar = () => {
    return (
        <div className="my-8 bg-white drop-shadow-lg rounded-md max-w-4xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 items-center">
            <div className="flex items-center gap-3">
                <Mail className="w-7 h-7 text-primary" />
                <div className="font-bold text-xl">Bulkmail Builder</div>
            </div>
            <div className="text-right mr-2">☕️</div>
        </div>
        </div>
    )
}

export default Navbar;