import type React from "react";
import { createContext, useContext, useState } from "react";

const InterviewContext = createContext({
	interviewData: null,
	setInterviewData: (data: any) => {},
	interviewMode: null,
	setInterviewMode: (mode: any) => {},
});

export const InterviewProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [interviewData, setInterviewData] = useState(null);
	const [interviewMode, setInterviewMode] = useState(null);

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

// Custom hook for easier use
export const useInterviewSetup = () => useContext(InterviewContext);
