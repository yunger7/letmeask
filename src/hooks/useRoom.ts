import { useEffect, useState } from "react";
import { database } from "../services/firebase";

type QuestionType = {
	id: string;
	author: {
		name: string;
		avatar: string;
	};
	content: string;
	isHighlighted: boolean;
	isAnswered: boolean;
};

type FirebaseQuestions = Record<
	string,
	{
		author: {
			name: string;
			avatar: string;
		};
		content: string;
		isHighlighted: boolean;
		isAnswered: boolean;
	}
>;

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
	const [title, setTitle] = useState("");

  useEffect(() => {
		const roomRef = database.ref(`rooms/${roomId}`);

		/*
    ? This method is not optimal
    TODO: Listen for specific events, such as child added, child removed, etc.
    */
		roomRef.on("value", room => {
			const databaseRoom = room.val();
			const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

			const parsedQuestions = Object.entries(firebaseQuestions).map(
				([key, value]) => ({
					id: key,
					content: value.content,
					author: value.author,
					isHighlighted: value.isHighlighted,
					isAnswered: value.isAnswered,
				})
			);

			setTitle(databaseRoom.title);
			setQuestions(parsedQuestions);
		});
	}, [roomId]);

  return { questions, title };
}