import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app.js";
import { User } from "../src/models/User.js";
import { Job } from "../src/models/Job.js";

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("AgentHire API Endpoints", () => {
  let authToken;
  let createdJobId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Job.deleteMany({});

    // Create recruiter
    const signupRes = await request(app).post("/api/auth/signup").send({
      name: "Jane Recruiter",
      email: "jane@agenthire.com",
      password: "securepassword123",
      role: "recruiter",
    });

    authToken = signupRes.body.token;
  });

  it("POST /api/auth/login should authenticate recruiter", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "jane@agenthire.com",
      password: "securepassword123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it("POST /api/jobs should create a job when authenticated", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Frontend Engineer",
        description: "Looking for skilled React and Next.js developers.",
        required_skills: ["React", "JavaScript", "CSS"],
        preferred_skills: ["Next.js", "Tailwind CSS"],
        min_experience: 2,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.job.title).toBe("Frontend Engineer");
    createdJobId = res.body.job._id;
  });

  it("GET /api/jobs should list jobs publicly without token", async () => {
    await Job.create({
      title: "Backend Engineer",
      description: "Express and Mongo engineer needed.",
      required_skills: ["Node.js", "MongoDB"],
    });

    const res = await request(app).get("/api/jobs");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.jobs.length).toBeGreaterThan(0);
  });

  it("GET /api/specs should return spec definitions", async () => {
    const res = await request(app).get("/api/specs");
    expect(res.status).toBe(200);
    expect(res.body.specs.defaultWorkflow).toBeDefined();
    expect(res.body.specs.nodeStates).toBeDefined();
  });

  it("GET /api/analytics should return aggregate metrics", async () => {
    const res = await request(app)
      .get("/api/analytics")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.analytics.overview).toBeDefined();
  });
});
