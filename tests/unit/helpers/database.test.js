const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const connectDB = require("../../../helper/database");

const expect = chai.expect;
require("dotenv").config({ path: "./.env.test" });

describe("Database Connection", () => {
  let mongooseConnectStub;
  let consoleLogStub;
  let consoleErrorStub;
  let processExitStub;

  beforeEach(() => {
    mongooseConnectStub = sinon.stub(mongoose, "connect");
    consoleLogStub = sinon.stub(console, "log");
    consoleErrorStub = sinon.stub(console, "error");
    processExitStub = sinon.stub(process, "exit");
  });

  afterEach(() => {
    mongooseConnectStub.restore();
    consoleLogStub.restore();
    consoleErrorStub.restore();
    processExitStub.restore();
  });

  it("should successfully connect to the database", async () => {
    mongooseConnectStub.resolves();

    await connectDB();

    const expectedOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    };

    expect(mongooseConnectStub.calledOnce).to.be.true;
    expect(mongooseConnectStub.firstCall.args[0]).to.equal(
      process.env.CONNECTION_STRING
    );
    expect(mongooseConnectStub.firstCall.args[1]).to.deep.equal(
      expectedOptions
    );
    expect(consoleLogStub.calledWith("MongoDB connected")).to.be.true;
  });

  it("should handle connection errors properly", async () => {
    const testError = new Error("Connection failed");
    mongooseConnectStub.rejects(testError);

    await connectDB();

    expect(
      consoleErrorStub.calledWith(
        "MongoDB connection error:",
        testError.message
      )
    ).to.be.true;
    expect(processExitStub.calledWith(1)).to.be.true;
  });
});
