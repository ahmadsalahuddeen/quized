import React, { useMemo } from 'react';
import keyword_extractor from 'keyword-extractor';
type Props = { answer: string };

const BLANKS = '_____';
const BlankAnwerInput = ({ answer }: Props) => {
  // extracting and shuffling keywords
  const keywords = React.useMemo(() => {
    const words = keyword_extractor.extract(answer, {
      language: 'english',
      remove_digits: true,
      return_changed_case: false,
      remove_duplicates: false,
    });

    const shuffled = words.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }, [answer]);

  const asnwerWithBlanks = React.useMemo(() => {
    const answerwihtblanks = keywords.reduce((acc, keyword) => {
      return acc.replace(keyword, BLANKS);
    }, answer);
    return answerwihtblanks;
  }, [keywords, answer]);
 
  console.log(asnwerWithBlanks);
  return (
    <div className=" flex justify-start w-full mt-4">
      <h1 className="text-xl font-semibold">
        {asnwerWithBlanks.split(BLANKS).map((part, index) => {
          return (
            <>
              {part}
              {index === asnwerWithBlanks.split(BLANKS).length - 1 ? null : (
                <input
                  id="user-blank-input"
                  className="text-center border-b-2 border-black dark:border-white w-28 focus: border-2 focus:outline-none focus:border-b-4"
                ></input>
              )}
            </>
          );
        })}
      </h1>

    </div>
  );
};

export default BlankAnwerInput;
