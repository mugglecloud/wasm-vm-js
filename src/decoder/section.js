class SectionPayload {
    name = '';
    data = ArrayBuffer.from([]);

    size() {
        return this.name.length + this.data.length;
    }
}

class Section {
    id = 0;
    payload;
}