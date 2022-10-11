export class Util {
    static waitUntilMidnight(): Promise<void> {
        return new Promise((resolve, reject) => {
            while (true) {
                if (new Date().getHours() === 20) {
                    resolve();
                    break;
                }
            }
        });
    }
}