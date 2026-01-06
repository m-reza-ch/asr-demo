import { useState } from "react";
import { ThemeProvider, createTheme, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import { useWhisperSTT } from "../hooks/useWhisperSTT";
import { AsrPanel } from "../components/AsrPanel";

export default function WhisperPage() {
  const [text, setText] = useState("");
  const whisper = useWhisperSTT(setText);
  const navigate = useNavigate();

  return (
    <Box
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      position="relative"
    >
      {/* Top-right button */}
      <Box position="absolute" top={16} right={16}>
        <Button
          variant="outlined"
          color="info"
          onClick={() => navigate("/vosk")}
        >
          Vosk ASR
        </Button>
      </Box>

      {/* Centered title */}
      <Typography variant="h4" align="center" gutterBottom>
        Whisper Persian ASR
      </Typography>

      {/* Centered ASR Panel */}
      <Box width={{ xs: "90%", sm: "600px" }}>
        <AsrPanel
          text={text}
          listening={whisper.listening}
          onStart={whisper.start}
          onStop={whisper.stop}
        />
      </Box>
    </Box>
  );
}
