class SlidingWindow {
  constructor(limit, windowSize, now = () => Date.now()) {
    this.limit = limit;
    this.windowSize = windowSize;
    this.requests = new Map();
    this.now = now;
  }

  allowRequest(userId) {
    const timestamps = this.requests.get(userId) || [];
    const currentTime = this.now();

    // Keep only requests still inside the sliding window
    const updatedTimestamps = timestamps.filter(
      (time) => currentTime - time < this.windowSize,
    );

    // Save cleaned timestamps
    this.requests.set(userId, updatedTimestamps);

    if (updatedTimestamps.length >= this.limit) {
      return false;
    }

    updatedTimestamps.push(currentTime);
    return true;
  }
}

let fakeTime = 0;

const limiter = new SlidingWindow(3, 10000, () => fakeTime);

console.log(limiter.allowRequest("user1")); // true
console.log(limiter.allowRequest("user1")); // true
console.log(limiter.allowRequest("user1")); // true
console.log(limiter.allowRequest("user1")); // false

// Different user has a separate limit
console.log(limiter.allowRequest("user2")); // true

// Move time forward by 5 seconds
fakeTime = 5000;

console.log(limiter.allowRequest("user1")); // false

// Move time forward to 10 seconds
fakeTime = 10000;

console.log(limiter.allowRequest("user1")); // true
