// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    struct Candidate {
        string name;
        uint voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedCandidateId;
    }

    struct Election {
        string name;
        uint startTime;
        uint endTime;
        bool isActive;
        Candidate[] candidates;
        mapping(address => Voter) voters;
        address[] voterList;
    }

    mapping(uint => Election) public elections;
    uint public electionCount;

    event ElectionCreated(uint electionId, string name);
    event VoterRegistered(uint electionId, address voter);
    event VoteCast(uint electionId, address voter, uint candidateId);
    event ElectionEnded(uint electionId);

    modifier onlyDuringElection(uint _electionId) {
        require(block.timestamp >= elections[_electionId].startTime, "Election not started yet");
        require(block.timestamp <= elections[_electionId].endTime, "Election has ended");
        require(elections[_electionId].isActive, "Election is not active");
        _;
    }

    modifier onlyBeforeElection(uint _electionId) {
        require(block.timestamp < elections[_electionId].startTime, "Election already started");
        _;
    }

    // Create a new election
    function createElection(string memory _name, uint _startTime, uint _endTime, string[] memory _candidateNames) public onlyOwner {
        require(_startTime < _endTime, "Invalid time window");
        require(_candidateNames.length > 1, "Need at least 2 candidates");

        Election storage e = elections[electionCount];
        e.name = _name;
        e.startTime = _startTime;
        e.endTime = _endTime;
        e.isActive = true;

        for (uint i = 0; i < _candidateNames.length; i++) {
            e.candidates.push(Candidate({name: _candidateNames[i], voteCount: 0}));
        }

        emit ElectionCreated(electionCount, _name);
        electionCount++;
    }

    // Register a voter for a specific election
    function registerVoter(uint _electionId, address _voter) public onlyOwner onlyBeforeElection(_electionId) {
        Election storage e = elections[_electionId];
        require(!e.voters[_voter].isRegistered, "Voter already registered");
        e.voters[_voter] = Voter({isRegistered: true, hasVoted: false, votedCandidateId: 0});
        e.voterList.push(_voter);

        emit VoterRegistered(_electionId, _voter);
    }

    // Cast vote
    function vote(uint _electionId, uint _candidateId) public onlyDuringElection(_electionId) {
        Election storage e = elections[_electionId];
        Voter storage voter = e.voters[msg.sender];

        require(voter.isRegistered, "Not registered");
        require(!voter.hasVoted, "Already voted");
        require(_candidateId < e.candidates.length, "Invalid candidate");

        voter.hasVoted = true;
        voter.votedCandidateId = _candidateId;
        e.candidates[_candidateId].voteCount++;

        emit VoteCast(_electionId, msg.sender, _candidateId);
    }

    // Get election result
    function getResults(uint _electionId) public view returns (string[] memory candidateNames, uint[] memory votes) {
        Election storage e = elections[_electionId];
        uint len = e.candidates.length;

        candidateNames = new string[](len);
        votes = new uint[](len);

        for (uint i = 0; i < len; i++) {
            candidateNames[i] = e.candidates[i].name;
            votes[i] = e.candidates[i].voteCount;
        }
    }

    // End the election manually
    function endElection(uint _electionId) public onlyOwner {
        Election storage e = elections[_electionId];
        e.isActive = false;
        emit ElectionEnded(_electionId);
    }

    // Get all voters (for audit)
    function getVoters(uint _electionId) public view returns (address[] memory) {
        return elections[_electionId].voterList;
    }

    // View election details
    function getElectionDetails(uint _electionId) public view returns (string memory, bool, uint, uint) {
        Election storage e = elections[_electionId];
        return (e.name, e.isActive, e.startTime, e.endTime);
    }
}
