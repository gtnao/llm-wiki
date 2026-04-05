---
title: "Leveraging Snowflake Cortex's Search to Build RAG Systems"
url: https://www.aimpointdigital.com/blog/snowflake-cortex-search-rag-systems
date: 2026-04-05
type: article
---

Large Language Models (LLMs) are transforming how businesses operate by offering unparalleled capabilities for human-like text generation and communication, search augmentation, and question-answering. However, LLMs often face challenges, particularly when it comes to accuracy and relevance. Retrieval Augmented Generation (RAG) is emerging as a popular solution that helps mitigate these problems. RAG combines specific information retrieval with the advanced generation capabilities of LLMs, resulting in a more accurate and contextually rich output. By integrating domain/organization-specific [data with pretrained LLMs](https://www.aimpointdigital.com/white-papers/pretraining-llms-trends-report), it offers the following benefits over pretraining or fine-tuning LLMs:

1.  **Enhanced accuracy and relevance:** RAG responses are anchored in domain/company-specific data, which reduces the risk of inaccuracies or hallucinations by standalone LLMs. This ensures that responses are better tailored to the user’s context and can even cite original sources of information, enabling manual verification.  
2.  **Latest information retrieval:** By leveraging up-to-date data sources provided by the user/organization, RAG ensures that the LLM responses are current, unlike standalone LLMs, which are not trained as frequently on new data. 
3.  **Cost-effective and quick implementation:** Unlike pre-training or fine-tuning an LLM, RAGs are easy and cost-effective to set up. Organizations can deploy RAG solutions without customizing the LLM, preventing the heavy resource investment typically required for training models from scratch.

**How RAGs Work: Key Concepts Explained** 
------------------------------------------

 RAGs consist of three key components: 

1.  **Retriever:** This component searches through domain/company-specific data to find relevant information and documents based on the user’s query **‍**
2.  **Generator:** This component is typically an off-the-shelf LLM (e.g., GPT and Llama models) that synthesizes the information the retriever obtains into coherent, contextually relevant text.  **‍**
3.  **Prompt Augmentation:** The prompt is augmented with the relevant chunks retrieved from the retriever. This provides the LLM context pertinent to generate an accurate, timely, and domain-specific response. 

The RAG process can be broken down into the following steps:  

1.  **Data Preparation:** Documents and their metadata are gathered and prepared. This may include data cleaning (such as cleaning HTML documents) and data parsing.  **‍**
2.  **Chunking:** The prepared data is then chunked into smaller and more manageable pieces of information. Chunk size is one of the key quality knobs that impacts the performance of a RAG. If a chunk size is too large, the retriever may have difficulty isolating relevant information. On the other hand, if the chunk size is too small, it may not contain enough information and context. The ideal chunk size offers a balance between too little and too much context and information.  **‍**
3.  **Embedding the chunks and creating a vector database:** Once the data is chunked, it is embedded in a vector representation to capture the semantic meaning of the text. Selecting the type of embedding model is another quality knob that impacts the performance of the RAG. The vector embeddings are then stored in a vector database for future retrieval.  **‍**
4.  **Select an LLM for Generation:** After creating the vector database, an LLM model needs to be selected for generation. The choice of generation LLM is another quality knob the impacts the performance of the RAG architecture.  **‍**
5.  **Retrieval:** With the vector database in place and a generation LLM selected, the RAG system is all set up to answer user queries. When a user submits a query, it is processed and converted to a vector representation. The embedded query is then matched with the vectors of data chunks and scored using a metric such as cosine similarity to obtain the most relevant chunks of data that match the user query.  **‍**
6.  **Generation:** The query and retrieved chunks are then input into the generation LLM to produce an accurate and contextually relevant response to the user’s query. 

**Designing a RAG with Snowflake and Dataiku** 
-----------------------------------------------

In one of our recent client engagements, we successfully developed a cutting-edge RAG Proof of Concept (PoC). The PoC chatbot incorporated complex client documents to respond to user queries regarding the client’s internal policies, while also offering chat history and a feedback mechanism for continuous improvement of the LLM. By leveraging Snowflake’s Cortex framework for the backend RAG chain and seamlessly integrating it with Dataiku’s web apps, we delivered a state-of-the-art solution that transformed how our client interacts with their data. 

### Key Features of RAG Design

To design this RAG PoC, we leveraged three key features of the Snowflake and Dataiku environments:

#### Snowflake’s Cortex Search 

[Cortex Search](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-search/cortex-search-overview) is Snowflake’s fully managed hybrid (vector and keyword) search service for documents and unstructured data that optimizes retrieval with automated semantic reranking. It processes natural language queries and returns the most relevant text results and corresponding metadata. Handling everything from text data embedding and infrastructure maintenance to search quality parameter tuning, Cortex Search allows you to focus on crafting exceptional chat experiences. Additionally, it simplifies document filtering based on metadata tags, ensuring secure access and streamlined document access management. We utilized Cortex Search to handle retrieval in our RAG design.

#### Snowflake’s Cortex LLM  

[Snowflake Cortex’s LLM](https://docs.snowflake.com/en/user-guide/snowflake-cortex/llm-functions) functions are a suite of AI tools that leverage state-of-the-art language models to enable a range of natural language processing tasks. You can access leading LLMs through these functions, which are fully hosted and managed by Snowflake, requiring no setup on your end. Moreover, your data remains within the Snowflake environment, ensuring governance and security. Using the COMPLETE function in our PoC, we leveraged LLM functions to access generation LLMs such as Mistral, Llama, and Snowflake-Arctic. 

For a breakdown of how to use the COMPLETE function, view a recent video in our Snowflake Cortex AI YouTube series below:

#### Dataiku’s Webapps  

By using a [Dataiku webapp](https://knowledge.dataiku.com/latest/data-viz/webapps/concept-webapps.html) we eliminated the need to manage and host an external webapp. For this PoC, we created a Dash webapp in Dataiku to serve as the frontend of the chatbot. Dash is an open-source framework in Python that develops web applications. The webapp featured a chat history mechanism that would store previous questions from the user to answer subsequent questions. The webapp also incorporated a thumbs up/thumbs down feature to allow the user to provide feedback to the RAG regarding the corresponding response.  If you are interested in a Snowflake webapp solution, [check out our blog post discussing Streamlit.](https://www.aimpointdigital.com/blog/how-to-deploy-streamlit-app-snowflake-native-app) 

How to Create a RAG Chain in Snowflake
--------------------------------------

As illustrated in the RAG architecture diagram below, we implemented a solution that utilizes Snowflake for the backend and Dataiku for the frontend user interface (UI).  

![RAG Architecture Diagram](https://cdn.prod.website-files.com/6603bc85bc604431b3053166/6728f97cefb141713583c25e_6728f90ffaa427a4fd0f4a38_image%2520\(19\).png)

The Snowflake RAG architecture backend is orchestrated through a SQL Stored Procedure which chains together the Cortex Search vector database, the augmented prompt, and the Cortex LLM to produce the final response to the end user. 

Setting up the Snowflake backend for the RAG consists of the following two steps: 

1.  **Data Ingestion, Parsing, and Chunking:** The first step to setting up the Snowflake backend involves creating a source table that contains the text chunks from the documents, which is required to develop a [Cortex Search service](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-search/cortex-search-overview). To do so, the unstructured files are stored in a Snowflake Stage, and as new files land in this stage, they are incrementally ingested into the source table using a Snowflake Python UDF to parse and chunk the files. The underlying table for the Cortex Search service is a dynamic table. Dynamic tables are a type of Snowflake table that incrementally refreshes data with the latest changes by materializing a SQL query into a table; by simply enabling change tracking in this source table and specifying a TARGET\_LAG, the Cortex search service is automatically updated with the most recent data. **‍**
2.  **Embedding the chunks and creating a vector database:** The source table of parsed and chunked documents is used to set up the Cortex Search Service from the source table and enables filtering on various metadata tags.  

Once the backend is built, from the Dataiku side, we make a call from Dataiku to the Snowflake store procedure.  A call to the Snowflake stored procedure triggers the following steps: 

1.  **Selection of an LLM for Generation:** The stored procedure has an argument that allows the developer to configure which LLM to use for generation.  
2.  **Retrieval:** The stored procedure takes in the user query and chat history as arguments and calls the Cortex search service previously created to retrieve _k_ most relevant documents, where _k_ is a configurable parameter.  
3.  **Generation:** The relevant documents, user query and chat history are used to generate a response from the selected generation LLM using the SNOWFLAKE.CORTEX. COMPLETE LLM function. This response is sent back to the Dataiku webapp for the user to see. 

The responses and chat history will be held in memory on the Dataiku side. Upon each conversational exchange between the user and AI chatbot the chat history, latency, and feedback will be written back to a Snowflake logs table. 

Reflecting on Snowflake’s RAG Features 
---------------------------------------

Snowflake streamlines the process of building vector databases by offering a managed solution called Cortex Search that automatically generates embeddings. Out of the box, it provides a hybrid retrieval mechanism by combining semantic similarity search with filtering capabilities. With the comprehensive features of Cortex AI, Snowflake has become an exceptional choice for customers looking to accelerate the development timeline of Retrieval Augmented Generation (RAG) solutions.  

Retrieval Augmented Generation (RAG) offers an effective way to demonstrate the potential of GenAI in your organization. Unlock your full GenAI capabilities with the support of the Aimpoint Digital team’s deep industry expertise in delivering GenAI solutions across GenAI strategy, RAG applications, fine-tuning, and pretraining.
