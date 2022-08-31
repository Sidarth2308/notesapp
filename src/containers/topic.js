import { HamburgerIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import React from "react";
import "./styles.css";
export default function Topic({
  topic,
  viewNotes,
  index,
  subjectId,
  subjectIndex
}) {
  return (
    <Flex className="Topic-Box">
      <Flex>{topic.name}</Flex>
      <HamburgerIcon
        mr="5px"
        cursor="pointer"
        onClick={() => {
          viewNotes(subjectId, subjectIndex, index);
        }}
      />
    </Flex>
  );
}
