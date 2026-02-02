import { cardProps } from "@/modules/card/card.types";


export function Card({ card }:cardProps) {


    return (
            <div className="flex flex-col bg-white rounded-xl p-4 shadow-sm gap-4 hover:shadow-md transition">
            
                <h4 className="font-semibold text-sm text-gray-900 text-center">
                    {card.title}
                </h4>

                {card.description && (
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {card.description}
                    </p>
                )}

                <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                    Comments
                    </span>

                    <div className="text-xs text-gray-400 italic">
                    No comments yet
                    </div>
                </div>

            </div>
    )
}