import {
  Box,
  CloseButton,
  Flex,
  Input,
  Spinner,
  Textarea
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import "./styles.css";
import { FirebaseContext } from "../context/firebase";
import Subjects from "../containers/subject";
import { v4 as uuidv4 } from "uuid";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

export default function Home() {
  const { firebase } = useContext(FirebaseContext);
  const [data, setData] = useState({
    fetched: false,
    subjects: []
  });
  const [editNotes, setEditNotes] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState({
    subjectId: "",
    subjectIndex: "",
    topicIndex: "",
    topic: {
      id: "",
      name: "",
      notes: []
    }
  });
  const [deleteTopicLoading, setDeleteTopicLoading] = useState(false);
  const [editTopicName, setEditTopicName] = useState({
    open: false,
    name: ""
  });
  const [editTopicNameLoading, setEditTopicNameLoading] = useState(false);
  const [addNoteLoading, setAddNoteLoading] = useState(false);
  const [deleteNoteLoading, setDeleteNoteLoading] = useState(false);
  const [editNote, setEditNote] = useState({
    open: false,
    note: "",
    index: -1
  });
  useEffect(() => {
    firebase
      .firestore()
      .collection("subjects")
      .get()
      .then((snapshot) => {
        const allContent = snapshot.docs.map((contentObj) => ({
          ...contentObj.data(),
          docId: contentObj.id
        }));
        setData({ fetched: true, subjects: allContent });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [firebase]);
  const handleOnAdd = (name) => {
    return new Promise((resolve, reject) => {
      const subjectId = uuidv4();
      const newData = { name: name, id: subjectId, topics: [] };
      firebase
        .firestore()
        .collection("subjects")
        .doc(subjectId)
        .set({ ...newData })
        .then(() => {
          setData((prev) => {
            return {
              fetched: true,
              subjects: [...prev.subjects, { ...newData }]
            };
          });
          resolve("success");
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };
  const handleSubjectEdit = (name, subjectId, index) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("subjects")
        .doc(subjectId)
        .update({ name: name })
        .then(() => {
          setData((prev) => {
            const newSubjects = prev.subjects;
            newSubjects[index] = { ...newSubjects[index], name: name };
            return {
              fetched: true,
              subjects: [...newSubjects]
            };
          });
          resolve("success");
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };
  const handleSubjectDelete = (subjectId, index) => {
    return new Promise((resolve, reject) => {
      const newSubjects = data.subjects;
      newSubjects.splice(index, 1);
      firebase
        .firestore()
        .collection("subjects")
        .doc(subjectId)
        .delete()
        .then(() => {
          setData({ fetched: true, subjects: [...newSubjects] });
          resolve("success");
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };
  const handleAddTopic = (subjectId, index) => {
    return new Promise((resolve, reject) => {
      const topicId = uuidv4();
      firebase
        .firestore()
        .collection("subjects")
        .doc(subjectId)
        .update({
          topics: [
            ...data.subjects[index].topics,
            { id: topicId, name: "New Topic", notes: [] }
          ]
        })
        .then(() => {
          const newSubjects = data.subjects;
          newSubjects[index].topics.push({
            id: topicId,
            name: "New Topic",
            notes: []
          });
          setData({ fetched: true, subjects: [...newSubjects] });
          resolve("success");
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };
  const handleDeleteTopic = () => {
    return new Promise((resolve, reject) => {
      const newTopics = data.subjects[selectedTopic.subjectIndex].topics;
      newTopics.splice(selectedTopic.topicIndex, 1);
      firebase
        .firestore()
        .collection("subjects")
        .doc(selectedTopic.subjectId)
        .update({
          topics: [...newTopics]
        })
        .then(() => {
          const newSubjects = data.subjects;
          newSubjects[selectedTopic.subjectIndex].topics = newTopics;
          setData({ fetched: true, subjects: [...newSubjects] });
          setEditNotes(false);
          // setSelectedTopic((prev) => {
          //   return { ...prev, topic: { ...prev.topic, name: name } };
          // });
          resolve("success");
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };
  const handleViewNotes = (subjectId, subjectIndex, topicIndex) => {
    const setterData = {
      subjectId: subjectId,
      subjectIndex: subjectIndex,
      topicIndex: topicIndex,
      topic: data.subjects[subjectIndex].topics[topicIndex]
    };
    setSelectedTopic({ ...setterData });
    setEditTopicName({ open: false, name: "" });
    setEditNotes(true);
  };
  const handleEditTopicName = (name) => {
    return new Promise((resolve, reject) => {
      const newTopics = data.subjects[selectedTopic.subjectIndex].topics;

      newTopics[selectedTopic.topicIndex].name = name;
      firebase
        .firestore()
        .collection("subjects")
        .doc(selectedTopic.subjectId)
        .update({
          topics: [...newTopics]
        })
        .then(() => {
          const newSubjects = data.subjects;
          newSubjects[selectedTopic.subjectIndex].topics[
            selectedTopic.topicIndex
          ].name = name;
          setData({ fetched: true, subjects: [...newSubjects] });
          setSelectedTopic((prev) => {
            return { ...prev, topic: { ...prev.topic, name: name } };
          });
          resolve("success");
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };
  const handleNoteAdd = () => {
    return new Promise((resolve, reject) => {
      const newTopics = data.subjects[selectedTopic.subjectIndex].topics;
      newTopics[selectedTopic.topicIndex].notes = [
        ...newTopics[selectedTopic.topicIndex].notes,
        "New Note"
      ];
      firebase
        .firestore()
        .collection("subjects")
        .doc(selectedTopic.subjectId)
        .update({
          topics: [...newTopics]
        })
        .then(() => {
          const newSubjects = data.subjects;
          newSubjects[selectedTopic.subjectIndex].topics = [...newTopics];
          setData({ fetched: true, subjects: [...newSubjects] });
          setSelectedTopic((prev) => {
            return {
              ...prev,
              topic: { ...newTopics[selectedTopic.topicIndex] }
            };
          });
          resolve("success");
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };
  const handleNoteDelete = (notesIndex) => {
    return new Promise((resolve, reject) => {
      const newTopics = data.subjects[selectedTopic.subjectIndex].topics;
      newTopics[selectedTopic.topicIndex].notes.splice(notesIndex, 1);
      firebase
        .firestore()
        .collection("subjects")
        .doc(selectedTopic.subjectId)
        .update({
          topics: [...newTopics]
        })
        .then(() => {
          const newSubjects = data.subjects;
          newSubjects[selectedTopic.subjectIndex].topics = [...newTopics];
          setData({ fetched: true, subjects: [...newSubjects] });
          setSelectedTopic((prev) => {
            return {
              ...prev,
              topic: { ...newTopics[selectedTopic.topicIndex] }
            };
          });
          resolve("success");
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };
  const handleEditNote = (textData, notesIndex) => {
    return new Promise((resolve, reject) => {
      const newTopics = data.subjects[selectedTopic.subjectIndex].topics;
      newTopics[selectedTopic.topicIndex].notes[notesIndex] = textData;
      firebase
        .firestore()
        .collection("subjects")
        .doc(selectedTopic.subjectId)
        .update({
          topics: [...newTopics]
        })
        .then(() => {
          const newSubjects = data.subjects;
          newSubjects[selectedTopic.subjectIndex].topics = [...newTopics];
          setData({ fetched: true, subjects: [...newSubjects] });
          setSelectedTopic((prev) => {
            return {
              ...prev,
              topic: { ...newTopics[selectedTopic.topicIndex] }
            };
          });
          setEditNote({ open: false, note: "", index: -1 });
          resolve("success");
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };
  return (
    <Flex className="Home-Container">
      {data.fetched ? (
        <>
          <Subjects
            subjects={data.subjects}
            addSubjectFn={handleOnAdd}
            deleteSubject={handleSubjectDelete}
            editSubject={handleSubjectEdit}
            addTopic={handleAddTopic}
            viewNotes={handleViewNotes}
          />
          <Box
            className={editNotes ? "Sidebar-Open" : "Sidebar-Closed"}
            zIndex="2"
          >
            <Flex className="Sidebar-Content">
              {editTopicName.open ? (
                editTopicNameLoading ? (
                  <Spinner color="white" className="Sidebar-Heading" />
                ) : (
                  <Input
                    value={editTopicName.name}
                    className="Sidebar-Heading"
                    fontSize="22px"
                    width="66%"
                    color="white"
                    onChange={(e) => {
                      setEditTopicName((prev) => {
                        return { ...prev, name: e.target.value };
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setEditTopicNameLoading(true);
                        handleEditTopicName(editTopicName.name)
                          .then(() => {
                            setEditTopicNameLoading(false);
                            setEditTopicName({ open: false, name: "" });
                          })
                          .catch((err) => {
                            console.log(err);
                            setEditTopicNameLoading(false);
                            setEditTopicName({ open: false, name: "" });
                          });
                      }
                    }}
                  />
                )
              ) : (
                <Flex
                  className="Sidebar-Heading"
                  onClick={() => {
                    setEditTopicName((prev) => {
                      return {
                        open: !prev.open,
                        name: selectedTopic.topic.name
                      };
                    });
                  }}
                >
                  {selectedTopic.topic.name}
                </Flex>
              )}
              <Flex className="Sidebar-Notes">
                <Flex className="Sidebar-NotesHeading">Notes</Flex>
                <Flex className="Sidebar-NotesBody">
                  {selectedTopic.topic.notes.map((note, noteIndex) => {
                    return (
                      <Flex className="Sidebar-Note" key={noteIndex}>
                        <Flex className="Sidebar-NoteHeading">
                          {note.length > 30 ? `${note.slice(0, 30)}...` : note}
                        </Flex>
                        <Flex
                          className="Sidebar-NoteDelete"
                          position="absolute"
                          right="10px"
                        >
                          <EditIcon
                            w={5}
                            h={5}
                            mr="10px"
                            cursor="pointer"
                            onClick={() => {
                              setEditNote((prev) => {
                                return {
                                  ...prev,
                                  open: true,
                                  note: selectedTopic.topic.notes[noteIndex],
                                  index: noteIndex
                                };
                              });
                            }}
                          />
                          {deleteNoteLoading ? (
                            <Spinner />
                          ) : (
                            <DeleteIcon
                              w={5}
                              h={5}
                              cursor="pointer"
                              onClick={() => {
                                setDeleteNoteLoading(true);
                                setEditNote({
                                  open: false,
                                  note: "",
                                  index: -1
                                });
                                handleNoteDelete(noteIndex)
                                  .then(() => {
                                    setDeleteNoteLoading(false);
                                  })
                                  .catch(() => {
                                    setDeleteNoteLoading(false);
                                  });
                              }}
                            />
                          )}
                        </Flex>
                      </Flex>
                    );
                  })}
                </Flex>
                {addNoteLoading ? (
                  <Flex className="Sidebar-NotesAdd">
                    <Spinner />
                  </Flex>
                ) : (
                  <Flex
                    className="Sidebar-NotesAdd"
                    onClick={() => {
                      setAddNoteLoading(true);
                      handleNoteAdd()
                        .then(() => {
                          setAddNoteLoading(false);
                        })
                        .catch(() => {
                          setAddNoteLoading(false);
                        });
                    }}
                  >
                    Add Note
                  </Flex>
                )}
                {editNote.open && (
                  <Flex className="Sidebar-NoteArea">
                    <Textarea
                      value={editNote.note}
                      rows="10"
                      columns="1"
                      resize="none"
                      onChange={(e) => {
                        setEditNote((prev) => {
                          return { ...prev, note: e.target.value };
                        });
                      }}
                    />
                    <Flex
                      className="Sidebar-NoteSubmit"
                      onClick={() => {
                        handleEditNote(editNote.note, editNote.index);
                      }}
                    >
                      Change Note
                    </Flex>
                  </Flex>
                )}
              </Flex>
            </Flex>

            <Flex position="absolute" top="10px" right="20px" color="white">
              {deleteTopicLoading ? (
                <Spinner />
              ) : (
                <>
                  <DeleteIcon
                    h={8}
                    w={8}
                    mr="20px"
                    cursor="pointer"
                    onClick={() => {
                      setDeleteTopicLoading(true);
                      handleDeleteTopic()
                        .then(() => {
                          setDeleteTopicLoading(false);
                        })
                        .catch(() => {
                          setDeleteTopicLoading(false);
                        });
                    }}
                  />
                  <EditIcon
                    h={8}
                    w={8}
                    mr="20px"
                    cursor="pointer"
                    onClick={() => {
                      setEditTopicName((prev) => {
                        return {
                          open: !prev.open,
                          name: selectedTopic.topic.name
                        };
                      });
                    }}
                  />
                  <CloseButton
                    h={8}
                    w={8}
                    backgroundColor="white"
                    color="black"
                    _hover={{ backgroundColor: "white" }}
                    onClick={() => {
                      setEditNotes(false);
                      setEditNote({ open: false, note: "", index: -1 });
                    }}
                  />
                </>
              )}
            </Flex>

            <Flex
              position="absolute"
              right="0"
              top="0"
              height="100%"
              width="5px"
              backgroundColor="#FFC23C"
            ></Flex>
          </Box>
          <Box
            className={editNotes ? "Sidebar-BehindOpen" : "Sidebar-BehindClose"}
          ></Box>
        </>
      ) : (
        <Spinner />
      )}
    </Flex>
  );
}
