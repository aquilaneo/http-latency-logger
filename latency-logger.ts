// 計測したレスポンスタイムを書き込むCSVファイルのパス
const filePath = "./response_times.csv";
// リクエスト対象のURL
const targetUrl = "https://example.com";
// 待機ミリ秒数
const waitTimeMs = 1000;

// CSVヘッダーを書き込む（初回のみ）
await Deno.writeTextFile(filePath, "Timestamp, ResponseTime(ms)\n");

while (true) {
    // リクエスト時間を計測
    const startTime = performance.now();
    await request(targetUrl);
    const endTime = performance.now();

    // レスポンスタイムを計算
    const responseTime = endTime - startTime;
    const fixedResponseTime = responseTime.toFixed(2);
    console.log(`${fixedResponseTime} ms`);

    // 現在のタイムスタンプとレスポンスタイムをCSVに書き込む
    const timestamp = new Date().toISOString();
    const csvRow = `${timestamp},${fixedResponseTime}\n`;
    await Deno.writeTextFile(filePath, csvRow, { append: true });

    // 指定時間待機
    await new Promise((resolve) => setTimeout(resolve, waitTimeMs));
}

// リクエストを送信する
async function request(targetUrl: string) {
    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
        }
        return response;
    } catch (error) {
        console.error(`Request failed: ${error}`);
        return null;
    }
}
