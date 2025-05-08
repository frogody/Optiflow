const fs = require('fs'); const filePath = 'src/components/livekit/VoiceAgentClient.tsx'; let content = fs.readFileSync(filePath, 'utf8');
content = content.replace('recognition.start();', 'setRecognitionRunning(true);
      recognition.start();');
content = content.replace('recognition.onstart = () => {', 'recognition.onstart = () => {
        setRecognitionRunning(true);');
content = content.replace(/recognition\.onend = \(\) => \{[\s\S]+?setContinuousRecognition\(false\);\s+\}\s+\};/, updatedOnend);
content = content.replace(/recognition\.onerror = \(event: any\) => \{[\s\S]+?300\);\s+\}\s+\}\s+\};/, updatedOnerror);
content = content.replace('const startContinuousListening = () => {', 'const startContinuousListening = () => {
    // Prevent duplicate initialization
    if (recognitionRunning) {
      console.log("Recognition already running, not starting again");
      return;
    }');
content = content.replace('stopContinuousListening();', 'stopContinuousListening();
      recognitionRef.current = null;
      setRecognitionRunning(false);');
fs.writeFileSync(filePath, content); console.log('Successfully updated VoiceAgentClient.tsx with improved speech recognition handling');
