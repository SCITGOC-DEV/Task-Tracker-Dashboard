import React, {useEffect, useState} from "react";

const TwoColumnsDetailsLayout = ({headings, contents, firstColumnTitle, secondColumnTitle, mainTitle = null}) => {
    // Calculate the midpoint for splitting the arrays
    const midIndex = Math.ceil(headings.length / 2);

    // Split headings and contents into left and right
    const leftHeadings = headings.slice(0, midIndex);
    const rightHeadings = headings.slice(midIndex);
    const [leftContents, setLeftContents] = useState([]);
    const [rightContents, setRightContents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedImage(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        setLeftContents(contents.slice(0, midIndex))
        setRightContents(contents.slice(midIndex))
    }, [contents]);

    return (
        <>
            <div className="w-full bg-white rounded-lg dark:bg-blue-950 dark:divide-gray-400 divide-gray-200 border ">
                {
                    mainTitle && (
                        <h1 className="justify-center mt-8 text-3xl dark:text-white font-extrabold flex">{mainTitle}</h1>
                    )
                }
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] p-4 gap-6">
                    {/* Left Column */}
                    <div className="p-4">
                        <h2 className="text-xl dark:text-white font-semibold">{firstColumnTitle}</h2>
                        <ul className="mt-2">
                            {leftHeadings.map((heading, index) => (
                                <li key={index} className="flex justify-between border-b py-2">
                                    <span className="font-medium">{heading}:</span>
                                    <span className="text-gray-600 dark:text-white/70">{leftContents[index]}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden md:block border-l border-gray-200 h-full"/>

                    {/* Right Column */}
                    <div className="p-4">
                        <h2 className="text-xl font-semibold">{secondColumnTitle}</h2>
                        <ul className="mt-2">
                            {rightHeadings.map((heading, index) => (
                                <li key={index} className="flex justify-between gap-4 items-center border-b py-2">
                                    <span className="font-medium ">{heading}:</span>
                                    <span className="text-gray-600 dark:text-white/70 text-right">
                                        {/* If signature_photo_url is provided, hide URL and show image */}
                                        {(heading === "Permit Photo" && rightContents[index] == null) || (heading === "Signature Photo" && rightContents[index] == null) ? (
                                            <div onClick={() => openModal(rightContents[index])}
                                                 className="cursor-pointer">
                                                <img
                                                    src={rightContents[index]}
                                                    alt={heading === "Permit Photo" ? "Permit" : "Signature"}
                                                    className="w-24 h-24 object-cover rounded border" // Adjusted size
                                                />
                                            </div>
                                        ) : (
                                            rightContents[index]
                                        )}
                        </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        className="p-4 rounded-lg shadow-lg flex flex-col"
                        style={{width: '80vw', height: '80vh'}} // 80% of viewport width and height
                    >
                        {/* Modal Content */}
                        <div className="flex-grow flex items-center justify-center overflow-hidden">
                            <img
                                src={selectedImage}
                                alt="Full View"
                                className="w-auto h-auto max-w-full rounded-lg max-h-full object-contain"
                            />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded self-center"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default TwoColumnsDetailsLayout;