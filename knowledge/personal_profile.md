# Profile Summary

I’m Jothsana Waikar, a recent B.Tech Computer Science graduate based in Mumbai. I enjoy building software from end to end and am interested in beginning my career in AI engineering. My experience includes full-stack development, backend systems, open-source engineering, workflow automation, and early experimentation with AI-powered applications. I’m particularly interested in building practical AI systems that solve real user problems rather than remaining only as demonstrations.

## Education

**B.Tech in Computer Science and Engineering**  
Nanasaheb Mahadik College of Engineering  
November 2022 – June 2026  
CGPA: 7.92/10

Relevant coursework includes Object-Oriented Programming, Operating Systems, Database Management Systems, and Computer Networks.

I consistently ranked first in my college across multiple semesters and participated in technical competitions and project-building events.

## Technical Skills

**Strongest languages:** JavaScript, TypeScript, Go  
**Working knowledge:** C, C++, Solidity, HTML, CSS, SQL, Python  
**Frontend:** React, Next.js, Electron, responsive web development  
**Backend:** Node.js, Express.js, REST APIs, GraphQL  
**Databases and infrastructure:** PostgreSQL, MongoDB, Redis, Docker, Kubernetes  
**Cloud-native tools:** Argo CD, GitOps, Kubernetes APIs, Git and GitHub workflows  
**Networking:** libp2p, mDNS, peer discovery, message relay  

I have built AI-assisted prototypes and received a Superteam Agentic Engineering Grant. 

## Project 1 — FlowPilot

FlowPilot is a workflow automation platform for creating and executing event-driven workflows.

I designed and built the application across its frontend, backend, and database layers. The system supports workflow creation, webhook-triggered executions, credential handling, execution queues, and tracking workflow runs.

The frontend uses Next.js, while the backend uses Express.js and Prisma. PostgreSQL stores persistent application data, and Redis supports queued and asynchronous execution. One important design decision was separating workflow definitions from individual executions so that the system could maintain execution history and eventually support retries and background workers.

The project helped me understand asynchronous processing, webhook handling, database modelling, API design, and the challenges involved in safely managing user credentials.

Repository: https://github.com/Joshna907/FlowPilot

## Project 2 — Sahaay

Sahaay is an offline-first emergency communication prototype designed for situations where internet connectivity may be unavailable after a disaster.

I built the networking core in Go using libp2p and mDNS. Devices on the same local network can discover one another and relay distress messages between peers. Messages use stable IDs for duplicate prevention and a TTL value to restrict how far they propagate. The system also retains messages and replays them to peers that join later, providing basic store-and-forward behaviour.

The user-facing prototype includes an Electron and React dashboard connected to a Go GraphQL service and MongoDB. The dashboard allows emergency requests to be created and viewed with details such as category, urgency, location, status, and acknowledgements.

The mesh networking layer is a working standalone vertical slice. The desktop application and mesh layer are not yet fully integrated, and replacing the infrastructure-dependent storage with embedded local storage would be an important next step.

Repository: https://github.com/Joshna907/Sahaay

## Experience

### LFX Open-Source Mentee — The Linux Foundation / CNCF Headlamp  
June 2026 – August 2026

I contributed to Headlamp, an open-source CNCF Kubernetes dashboard. My work focused on its Argo CD plugin, including application visibility, health and synchronization information, and Kubernetes-native application actions.

I worked through public GitHub discussions, implementation, code review, and maintainer feedback. This experience taught me how to understand an existing codebase, communicate asynchronously, and ship changes within an established open-source project.

After completing the mentorship, I was invited to participate as a mentor for a subsequent Headlamp LFX mentorship project.

Project: https://github.com/headlamp-k8s/plugins/tree/main/argocd

### Full-Stack Developer Intern — Vessify  
January 2026 – April 2026

I worked with product and frontend teams to understand requirements, coordinate priorities, and deliver application features. I also designed and implemented backend APIs and server-side functionality using Node.js.

### Backend Developer Intern — Sunday Tech  
July 2024 – November 2024

I developed REST APIs using Node.js and Express.js. My work included request validation, authentication, authorization, and protecting backend endpoints using standard security practices.

## Achievements

- Recipient of the Superteam Agentic Engineering Grant for work involving agent-based engineering.
- Selected for the Linux Foundation’s LFX Mentorship Program to contribute to CNCF Headlamp.
- Subsequently invited to mentor a Headlamp project in a later LFX mentorship term.
- Consistently secured first rank in college across multiple semesters.
- Won first prize at the Intercollege Avishkaar Tech Fest for an innovative technical project and coding challenge.
- Ranked among the top 250 participants nationally in AIWOS and received an INR 2,000 bounty for MaidFinder.

## Working Style and Interests

I enjoy problems that require me to understand a system from the user interface down to its APIs, data model, and deployment environment. I learn best by building a working version, testing it, identifying where it fails, and improving it through feedback.

I am comfortable working independently, but I also value clear communication, code review, and written documentation. My open-source experience has taught me to ask focused questions, explain technical decisions, and respond constructively to feedback.

This AI engineering internship interests me because it combines software engineering with a fast-changing technical field. I want to deepen my knowledge of LLM applications, retrieval systems, agents, evaluation, observability, and reliable deployment while contributing my existing full-stack and backend experience to useful products.

## Contact and Links

**Email:** joshnawaikar@gmail.com  
**Portfolio:** https://www.jothsana.xyz/  
**GitHub:** https://github.com/Joshna907  
**LinkedIn:** https://linkedin.com/in/jothsana-waikar-a37a8423a  
**X:** https://x.com/JothsanaW