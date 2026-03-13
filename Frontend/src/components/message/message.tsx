


export function Message({ message, type, onClose }: { message: string, type: string, onClose: () => void }) {

    const colors = type === "error" ? "bg-red-100 border border-red-400 text-red-700" : "bg-green-100 border border-green-400 text-green-700"

    return  <div className={`relative flex items-center ${colors} px-3 py-2 rounded`}>
        <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
            {message}
        </span>
        <button onClick={onClose} className="ml-auto font-bold hover:text-red-900">
            ✕
        </button>
    </div>
}