import re
import zipfile
from statistics import mean


class TextAnalyzer:
    def __init__(self, input_file, output_file, archive_file):
        self.input_file = input_file
        self.output_file = output_file
        self.archive_file = archive_file
        self.text = ""

    def read_text(self):
        with open(self.input_file, "r", encoding="utf-8") as file:
            self.text = file.read()

    def sentence_count(self):
        pattern = r'[.!?]'
        sentences = re.findall(pattern, self.text)
        return len(sentences)

    def sentences_by_type(self):
        pattern = r'[.!?]'
        endings = re.findall(pattern, self.text)
        declarative = endings.count('.')
        interrogative = endings.count('?')
        imperative = endings.count('!')
        
        return {
            "Declarative": declarative,
            "Interrogative": interrogative,
            "Imperative": imperative
        }
    
    def average_sentence_length(self):
        sentences = re.split(r'[.!?]', self.text)
        
        total_chars = 0
        num_sentences = 0

        for sentence in sentences:
            if not sentence.strip():
                continue

            words = re.findall(r"[a-zA-Z']+", sentence)
            sentence_length = sum(len(word) for word in words)
            
            total_chars += sentence_length
            num_sentences += 1

        return total_chars / num_sentences if num_sentences > 0 else 0

    def average_word_length(self):
        words = re.findall(r"[a-zA-Z']+", self.text)
        
        if not words:
            return 0.0
        
        total_chars = sum(len(word) for word in words)
        return total_chars / len(words)
    
    def count_smileys(self):
        pattern = r'[:;]-*([()\[\]])'
        smileys = re.findall(pattern, self.text)
        return len(smileys)

    def find_telephone_numbers(self):
        phones = re.findall(r'\b29\d{7}\b', self.text)
        return phones

    def find_words_with_pattern(self):
        vowel = r'[aeiouAEIOU]'
        consonant = r'[^aeiouAEIOU\W\d]'
        pattern = fr'\b[a-zA-Z]{consonant}{vowel}[a-zA-Z]*\b'
        return re.findall(pattern, self.text)

    def analyze_and_save(self):
        self.read_text()
        
        results = {
            "Total sentences": self.sentence_count(),
            "Sentences by type": self.sentences_by_type(),
            "Average sentence length": self.average_sentence_length(),
            "Average word length": self.average_word_length(),
            "Smileys count": self.count_smileys(),
            "Phone numbers starting with 29": self.find_telephone_numbers(),
            "Words with consonant-vowel pattern": self.find_words_with_pattern()
        }

        with open(self.output_file, "w", encoding="utf-8") as f:
            for key, value in results.items():
                f.write(f"{key}: {value}\n")

            with zipfile.ZipFile(self.archive_file, 'w') as zipf:
                zipf.write(self.output_file)


        return results

if __name__ == "__main__":
    analyzer = TextAnalyzer(
        input_file="input.txt",
        output_file="output.txt",
        archive_file="results.zip"
    )
    
    results = analyzer.analyze_and_save()
    
    for key, value in results.items():
        print(f"{key}: {value}")