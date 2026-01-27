import Button from '@/shared/ui/Button'

export function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Teethcast
        </h1>
        <p className="text-center text-lg">
          우리나라 각 지역에 대한 날씨 정보를 확인할 수 있는 서비스입니다.
        </p>
        <Button>버튼</Button>
      </div>
    </main>
  );
}
