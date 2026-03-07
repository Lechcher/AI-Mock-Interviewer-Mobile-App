import { createContext, useContext, useState } from "react";

import type React from "react";

interface InterviewContextType {
	interviewData: any;
	setInterviewData: (data: any) => void;
	interviewMode: "chat" | "voice";
	setInterviewMode: (mode: "chat" | "voice") => void;
}

const InterviewContext = createContext<InterviewContextType>({
	interviewData: null,
	setInterviewData: () => {},
	interviewMode: null as any,
	setInterviewMode: () => {},
});

export const InterviewProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [interviewData, setInterviewData] = useState(null);
	const [interviewMode, setInterviewMode] = useState<"chat" | "voice">(
		null as any,
	);

	return (
		<InterviewContext.Provider
			value={{
				interviewData,
				setInterviewData,
				interviewMode,
				setInterviewMode,
			}}
		>
			{children}
		</InterviewContext.Provider>
	);
};

export const useInterviewSetup = () => useContext(InterviewContext);
