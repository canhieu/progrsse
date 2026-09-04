/* ==========================================================================
   BrowserFlow Lab - Quiz System (Fixed option rendering & evaluation)
   ========================================================================== */

import { QUIZ_QUESTIONS } from '../data/quiz-data.js';

export class QuizSystem {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.questions = QUIZ_QUESTIONS;
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;

    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = "";

    if (this.currentIndex >= this.questions.length) {
      this.renderSummary();
      return;
    }

    const q = this.questions[this.currentIndex];
    this.answered = false;

    const card = document.createElement("div");
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "14px";

    // Progress header
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.innerHTML = `
      <span style="background: #eff6ff; color: #1d4ed8; font-weight: 700; font-size: 11px; padding: 3px 8px; border-radius: 4px; border: 1px solid #bfdbfe;">
        Câu hỏi ${this.currentIndex + 1} / ${this.questions.length}
      </span>
      <span style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">
        Điểm: <strong style="color: #2563eb;">${this.score}</strong> / ${this.questions.length}
      </span>
    `;
    card.appendChild(header);

    // Question title
    const qTitle = document.createElement("h3");
    qTitle.style.fontSize = "15px";
    qTitle.style.fontWeight = "700";
    qTitle.style.color = "var(--text-main)";
    qTitle.style.lineHeight = "1.5";
    qTitle.textContent = q.question;
    card.appendChild(qTitle);

    // Options list
    const optionsContainer = document.createElement("div");
    optionsContainer.style.display = "flex";
    optionsContainer.style.flexDirection = "column";
    optionsContainer.style.gap = "8px";

    q.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.style.display = "flex";
      btn.style.alignItems = "flex-start";
      btn.style.textAlign = "left";
      btn.style.padding = "10px 14px";
      btn.style.fontSize = "13px";
      btn.style.lineHeight = "1.5";
      btn.style.borderRadius = "6px";
      btn.style.border = "1px solid var(--border-default)";
      btn.style.backgroundColor = "var(--bg-card)";
      btn.style.cursor = "pointer";
      btn.style.transition = "all 0.15s";

      const optText = typeof opt === 'string' ? opt : opt.text;

      btn.innerHTML = `
        <span style="font-weight: 700; margin-right: 8px; color: #2563eb;">${opt.id || String.fromCharCode(65 + index)}.</span>
        <span style="flex: 1; color: var(--text-secondary);">${optText.replace(/^[A-D]\.\s*/, '')}</span>
      `;

      btn.addEventListener("click", () => {
        if (this.answered) return;
        this.handleAnswer(opt, index, q, card, optionsContainer);
      });

      optionsContainer.appendChild(btn);
    });

    card.appendChild(optionsContainer);

    // Feedback Box
    const feedbackBox = document.createElement("div");
    feedbackBox.id = "quiz-feedback-box";
    card.appendChild(feedbackBox);

    this.container.appendChild(card);
  }

  handleAnswer(selectedOpt, selectedIndex, question, card, optionsContainer) {
    this.answered = true;
    const isCorrect = selectedOpt.correct === true;
    if (isCorrect) this.score++;

    const buttons = optionsContainer.querySelectorAll("button");
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      btn.style.cursor = "default";
      const opt = question.options[idx];
      if (opt.correct === true) {
        btn.style.backgroundColor = "#ecfdf5";
        btn.style.borderColor = "#10b981";
        btn.style.color = "#065f46";
      } else if (idx === selectedIndex) {
        btn.style.backgroundColor = "#fef2f2";
        btn.style.borderColor = "#ef4444";
        btn.style.color = "#991b1b";
      }
    });

    const feedbackBox = card.querySelector("#quiz-feedback-box");
    if (feedbackBox) {
      feedbackBox.innerHTML = `
        <div style="background: ${isCorrect ? '#f0fdf4' : '#fef2f2'}; border: 1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}; border-radius: 6px; padding: 14px; margin-top: 10px;">
          <div style="font-weight: 700; color: ${isCorrect ? '#166534' : '#991b1b'}; margin-bottom: 6px; font-size: 14px;">
            ${isCorrect ? '✓ Đáp án hoàn toàn chính xác!' : '✗ Chưa chính xác!'}
          </div>
          <p style="font-size: 13px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 12px;">
            ${question.explanation}
          </p>
          <div style="text-align: right;">
            <button class="btn btn-primary btn-sm" id="btn-next-quiz-question">
              ${this.currentIndex < this.questions.length - 1 ? 'Câu kế tiếp →' : 'Xem kết quả tổng kết 🏆'}
            </button>
          </div>
        </div>
      `;

      const nextBtn = feedbackBox.querySelector("#btn-next-quiz-question");
      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          this.currentIndex++;
          this.render();
        });
      }
    }
  }

  renderSummary() {
    const total = this.questions.length;
    const percent = Math.round((this.score / total) * 100);

    const summaryCard = document.createElement("div");
    summaryCard.style.textAlign = "center";
    summaryCard.style.padding = "24px 16px";

    summaryCard.innerHTML = `
      <div style="font-size: 40px; margin-bottom: 8px;">${percent >= 80 ? '🏆' : '📚'}</div>
      <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">
        ${percent >= 80 ? 'Tuyệt vời! Bậc thầy Kiến trúc Trình duyệt' : 'Hoàn thành bài ôn tập!'}
      </h3>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
        Bạn đã trả lời đúng <strong>${this.score} / ${total}</strong> câu hỏi (${percent}%).
      </p>
      <button class="btn btn-primary" id="btn-replay-quiz">Làm lại bài trắc nghiệm 🔄</button>
    `;

    const replayBtn = summaryCard.querySelector("#btn-replay-quiz");
    if (replayBtn) {
      replayBtn.addEventListener("click", () => {
        this.currentIndex = 0;
        this.score = 0;
        this.render();
      });
    }

    this.container.appendChild(summaryCard);
  }
}
