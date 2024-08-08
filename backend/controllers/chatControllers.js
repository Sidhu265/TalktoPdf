import dotenv from "dotenv";
import multer from 'multer';
import path from 'path';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'; // Adjust based on actual export
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from '@langchain/openai';
import { RetrievalQAChain } from "langchain/chains";
// import { RetrievalQAChain } from '@langchain/community/document_loaders/fs/pdf'; // Adjust based on actual export
import { OpenAI } from '@langchain/openai';

dotenv.config();


export const chatController = async (req, res) => {
    try{
        console.log("hi");
        const loader = new PDFLoader("C:/chtwithpdf/backend/uploads/example1.pdf");
        const docs = await loader.load();

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 100,
            chunkOverlap: 10,
        });
        const splittedDocs = await splitter.splitDocuments(docs);

        const embeddings = new OpenAIEmbeddings();
        console.log(embeddings);

        const vectorStore = await FaissStore.fromDocuments(splittedDocs, embeddings);
        console.log(vectorStore);

        const vectorStoreRetriever = vectorStore.asRetriever();

        const model = new OpenAI({
            modelName: 'gpt-4o-mini',
            maxTokens: 200
        });

        const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever);

        // const question = 'what is the value of CTC';
        const question = req.body.question;
        const answer = await chain.call({
            query: question
        });
        console.log(answer);
        return res.status(200).json({
            result: answer.text,
        });
        // return res.status(200).json({
        //     result: answer,
        // });
        

    } catch(err){
        console.log(err);
        return res.status(404).json({
            message: err.message,
        });
    }
};


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, '../uploads');
        cb(null, path.join('C:/chtwithpdf/backend', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `example1.pdf`);
    }
});
export const upload=multer({storage: storage});

export const pdfController = async (req, res) => {
    try{
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        res.json({ message: 'File uploaded successfully', file: req.file });

    } catch(err){
        console.log(err);
        return res.status(404).json({
            message: err.message,
        });
    }
};