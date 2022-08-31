import { CloseButton, Flex, Input, Spinner } from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

import React, { useState } from "react";
import "./styles.css";
import Topic from "./topic";

const Subject = ({
  subject,
  index,
  deleteSubject,
  editSubject,
  addTopic,
  viewNotes
}) => {
  const [loading, setLoading] = useState(false);
  const [openEditName, setOpenEditName] = useState(false);
  const [editName, setEditName] = useState("");
  const [addTopicLoading, setAddTopicLoading] = useState(false);
  return (
    <Flex className="Subject-Container" key={subject.id}>
      {openEditName ? (
        <Input
          width="80%"
          fontSize="30px"
          textAlign="center"
          className="Subject-HeadingInput"
          value={editName}
          onChange={(e) => {
            setEditName(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setLoading(true);
              editSubject(editName, subject.id, index)
                .then((success) => {
                  setLoading(false);
                  setOpenEditName(false);
                })
                .catch(() => {
                  setLoading(false);
                });
            }
          }}
          mt="5px"
          mb="5px"
        />
      ) : (
        <Flex
          className="Subject-Heading"
          onClick={() => {
            setOpenEditName(true);
            setEditName(subject.name);
          }}
        >
          {subject.name}
        </Flex>
      )}

      <Flex className="Subject-PostHeading">Topics</Flex>
      {subject.topics.length > 0 && (
        <Flex className="Subject-TopicsContainer">
          {subject.topics.map((topic, topicIndex) => {
            return (
              <Topic
                key={topic.id}
                subjectId={subject.id}
                subjectIndex={index}
                topic={topic}
                index={topicIndex}
                viewNotes={viewNotes}
              />
            );
          })}
        </Flex>
      )}
      {addTopicLoading ? (
        <Spinner position="absolute" bottom="50px" />
      ) : (
        <Flex
          className="Subject-AddTopic"
          onClick={() => {
            setAddTopicLoading(true);
            addTopic(subject.id, index)
              .then(() => {
                setAddTopicLoading(false);
              })
              .catch(() => {
                setAddTopicLoading(false);
              });
          }}
        >
          Add Topic
        </Flex>
      )}

      {loading ? (
        <Spinner position="absolute" bottom="10px" right="20px" w={8} h={8} />
      ) : (
        <Flex position="absolute" bottom="10px" right="20px">
          <EditIcon
            w={8}
            h={8}
            cursor="pointer"
            mr={4}
            onClick={() => {
              setOpenEditName((prev) => !prev);
              setEditName(subject.name);
            }}
          />
          <DeleteIcon
            w={8}
            h={8}
            cursor="pointer"
            onClick={() => {
              setLoading(true);
              deleteSubject(subject.id, index)
                .then((success) => {
                  setLoading(false);
                })
                .catch(() => {
                  setLoading(false);
                });
            }}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default function Subjects({
  subjects,
  addSubjectFn,
  deleteSubject,
  editSubject,
  addTopic,
  viewNotes
}) {
  const [addSubject, setAddSubject] = useState(false);
  const [addSubjectData, setAddSubjectData] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <Flex className="Subject-Box">
      {subjects.map((subject, index) => {
        return (
          <Subject
            subject={subject}
            index={index}
            deleteSubject={deleteSubject}
            editSubject={editSubject}
            key={subject.id}
            addTopic={addTopic}
            viewNotes={viewNotes}
          />
        );
      })}
      {addSubject ? (
        <Flex className="Subject-AddButtonOpen">
          <CloseButton
            position="absolute"
            top="10px"
            right="20px"
            onClick={() => {
              setAddSubject(false);
            }}
          />
          {loading ? (
            <Spinner />
          ) : (
            <Input
              focus
              value={addSubjectData}
              type="text"
              placeholder="Subject Name"
              width="60%"
              color="black"
              _placeholder={{ color: "black" }}
              border="2px solid black"
              borderColor="black"
              fontSize="22px"
              _hover={{ borderColor: "black" }}
              onChange={(e) => {
                setAddSubjectData(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setLoading(true);
                  addSubjectFn(addSubjectData)
                    .then(() => {
                      setAddSubjectData("");
                      setLoading(false);
                      setAddSubject(false);
                    })
                    .catch(() => {
                      setLoading(false);
                    });
                }
              }}
            />
          )}
        </Flex>
      ) : (
        <Flex
          className="Subject-AddButtonClose"
          onClick={() => {
            setAddSubject(true);
          }}
        >
          <Flex> Add Subject</Flex>

          <AddIcon mt="10px" />
        </Flex>
      )}
    </Flex>
  );
}
