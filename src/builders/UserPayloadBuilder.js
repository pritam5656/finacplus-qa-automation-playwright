/** Fluent builder for user API payloads. */
class UserPayloadBuilder {
  constructor() {
    this._name = '';
    this._job = '';
  }

  withName(name) {
    this._name = name;
    return this;
  }

  withJob(job) {
    this._job = job;
    return this;
  }

  from(template = {}) {
    if (template.name !== undefined) this._name = template.name;
    if (template.job !== undefined) this._job = template.job;
    return this;
  }

  build() {
    if (!this._name || !this._job) {
      throw new Error('UserPayloadBuilder requires both name and job');
    }
    return { name: this._name, job: this._job };
  }

  static create(defaults = {}) {
    return new UserPayloadBuilder().from(defaults);
  }
}

module.exports = { UserPayloadBuilder };
